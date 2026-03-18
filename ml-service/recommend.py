"""
ShopAI Recommendation Engine
Uses Collaborative Filtering (user-based) to suggest products
"""

import mysql.connector
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "YOUR_MYSQL_PASSWORD",
    "database": "shopai"
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def get_recommendations(user_id: int, top_n: int = 8):
    """
    Collaborative Filtering:
    - Find users with similar purchase history
    - Recommend products they bought that current user hasn't seen
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get all user-product interactions
        cursor.execute("""
            SELECT user_id, product_id, COUNT(*) as interaction_count
            FROM user_behaviour
            WHERE action IN ('PURCHASE', 'CART', 'VIEW')
            GROUP BY user_id, product_id
        """)
        rows = cursor.fetchall()

        if not rows:
            # Fallback: return top rated products
            return get_top_products(cursor)

        # Build user-product matrix
        df = pd.DataFrame(rows)
        matrix = df.pivot_table(index='user_id', columns='product_id', values='interaction_count', fill_value=0)

        if user_id not in matrix.index:
            return get_top_products(cursor)

        # Cosine similarity between users
        similarity = cosine_similarity(matrix)
        sim_df = pd.DataFrame(similarity, index=matrix.index, columns=matrix.index)

        # Get similar users (top 5)
        similar_users = sim_df[user_id].sort_values(ascending=False)[1:6].index.tolist()

        # Products current user already interacted with
        user_products = set(df[df['user_id'] == user_id]['product_id'].tolist())

        # Recommend products from similar users
        recommended_ids = set()
        for similar_user in similar_users:
            user_data = df[df['user_id'] == similar_user]
            for _, row in user_data.iterrows():
                if row['product_id'] not in user_products:
                    recommended_ids.add(int(row['product_id']))
            if len(recommended_ids) >= top_n:
                break

        # Fetch product details
        if recommended_ids:
            placeholders = ','.join(['%s'] * len(recommended_ids))
            cursor.execute(f"SELECT id, name, price, original_price, rating, image_url FROM products WHERE id IN ({placeholders})", list(recommended_ids))
            products = cursor.fetchall()
        else:
            products = get_top_products(cursor)

        cursor.close()
        conn.close()
        return products[:top_n]

    except Exception as e:
        print(f"Recommendation error: {e}")
        return []


def get_top_products(cursor):
    """Fallback: return top rated products"""
    cursor.execute("SELECT id, name, price, original_price, rating, image_url FROM products ORDER BY rating DESC LIMIT 8")
    return cursor.fetchall()


def get_also_bought(product_id: int, top_n: int = 5):
    """
    Association Rule Mining (simplified):
    - Find products frequently purchased together
    - Returns pre-computed associations from DB
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT p.id, p.name, p.price, p.image_url, pa.confidence_score
            FROM product_associations pa
            JOIN products p ON p.id = pa.associated_product_id
            WHERE pa.product_id = %s
            ORDER BY pa.confidence_score DESC
            LIMIT %s
        """, (product_id, top_n))

        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results

    except Exception as e:
        print(f"Also-bought error: {e}")
        return []
