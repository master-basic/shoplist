#!/usr/bin/env python3
"""
Seed Data Script for GroceryMind
=================================

Creates sample users with known plaintext passwords for testing.

Usage:
    python seed_data.py

Or with environment variables:
    export DB_HOST=localhost
    export DB_PORT=5432
    export DB_NAME=grocerymind
    export DB_USER=postgres
    export DB_PASSWORD=postgres
    python seed_data.py

Default users created:
- admin@shoplist.com / Admin123!
- test1@example.com / Test123!
- test2@example.com / Test456!
"""

import os
import sys
import argparse
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from dotenv import load_dotenv

try:
    import psycopg2
    from psycopg2 import sql, extras
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("Error: psycopg2 is required. Install with: pip install psycopg2-binary")
    sys.exit(1)

try:
    from bcrypt import hashpw, gensalt
except ImportError:
    print("Error: bcrypt is required. Install with: pip install bcrypt")
    sys.exit(1)

def get_db_connection():
    """Create database connection."""
    load_dotenv()
    
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', 5432)),
        'database': os.getenv('DB_NAME', 'grocerymind'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', ''),
    }
    
    conn = None
    try:
        conn = psycopg2.connect(**db_config)
        print(f"Connected to database: {db_config['database']}")
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)
    
    return conn

def hash_password(plaintext_password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    return hashpw(plaintext_password.encode('utf-8'), gensalt()).decode('utf-8')

def get_all_users(conn) -> List[Dict[str, Any]]:
    """Get all existing users."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = sql.SQL("""
        SELECT id, email, password_hash, password_plaintext 
        FROM users 
        ORDER BY id
    """)
    
    cursor.execute(query)
    users = cursor.fetchall()
    cursor.close()
    
    return users

def create_user(conn, email: str, password: str, name: str = None, is_admin: bool = False) -> Dict[str, Any]:
    """Create a new user with hashed and plaintext passwords."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Hash the password
    password_hash = hash_password(password)
    
    # Generate UUID
    import uuid
    user_id = str(uuid.uuid4())
    
    try:
        query = sql.SQL("""
            INSERT INTO users (id, email, password_hash, password_plaintext, name, is_admin, preferred_currency, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, email, name, password_plaintext
        """)
        
        cursor.execute(query, (
            user_id, email, password_hash, password,
            name or email.split('@')[0].title(), is_admin, 'AZN',
            datetime.now(timezone.utc)
        ))
        
        conn.commit()
        result = cursor.fetchone()
        print(f"  Created user: {result['email']} / {result['password_plaintext']}")
        return result
    except psycopg2.Error as e:
        conn.rollback()
        print(f"  Error creating user: {e}")
        return None
    finally:
        cursor.close()

def create_admin_user(conn) -> Dict[str, Any]:
    """Create an admin user."""
    import uuid
    user_id = str(uuid.uuid4())
    email = "admin@shoplist.com"
    password = "Admin123!"
    name = "Admin User"
    
    return create_user(conn, email, password, name, is_admin=True)

def create_test_users(conn) -> None:
    """Create test users."""
    users = [
        ("test1@example.com", "Test123!", "Test User 1"),
        ("test2@example.com", "Test456!", "Test User 2"),
    ]
    
    for email, password, name in users:
        create_user(conn, email, password, name, is_admin=False)

def get_user_id_by_email(conn, email: str) -> str:
    """Get user ID by email."""
    cursor = conn.cursor()
    query = "SELECT id FROM users WHERE email = %s LIMIT 1"
    cursor.execute(query, (email,))
    result = cursor.fetchone()
    cursor.close()
    if result:
        return result['id']
    raise Exception(f"User not found with email: {email}")

def create_sample_households(conn) -> None:
    """Create sample households for test users."""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO households (id, name, description, created_by, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """
    
    # Get admin user ID
    admin_user_id = get_user_id_by_email(conn, "admin@shoplist.com")
    
    households = [
        (str(uuid.uuid4()), "Family Shopping", "Main family grocery list", admin_user_id, datetime.now(timezone.utc)),
        (str(uuid.uuid4()), "Office Supplies", "Office procurement list", admin_user_id, datetime.now(timezone.utc)),
    ]
    
    for household_id, name, description, created_by, created_at in households:
        cursor.execute(query, (household_id, name, description, created_by, created_at))
        print(f"  Created household: {name}")
    
    conn.commit()
    cursor.close()

def get_household_id(conn, name: str) -> str:
    """Get household ID by name."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    query = "SELECT id FROM households WHERE name = %s LIMIT 1"
    cursor.execute(query, (name,))
    result = cursor.fetchone()
    cursor.close()
    if result:
        return result['id']
    raise Exception(f"Household not found with name: {name}")

def create_sample_lists(conn) -> None:
    """Create sample grocery lists."""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO grocery_lists (id, household_id, name, created_by, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """
    
    # Get household IDs and admin user ID
    family_household_id = get_household_id(conn, "Family Shopping")
    admin_user_id = get_user_id_by_email(conn, "admin@shoplist.com")
    
    lists = [
        (str(uuid.uuid4()), family_household_id, "Weekly Groceries", admin_user_id, datetime.now(timezone.utc)),
        (str(uuid.uuid4()), family_household_id, "Monthly Stockup", admin_user_id, datetime.now(timezone.utc) - timedelta(days=7)),
        (str(uuid.uuid4()), family_household_id, "Office Essentials", admin_user_id, datetime.now(timezone.utc) - timedelta(days=14)),
    ]
    
    for list_id, household_id, name, created_by, created_at in lists:
        cursor.execute(query, (list_id, household_id, name, created_by, created_at))
        print(f"  Created list: {name}")
    
    conn.commit()
    cursor.close()

def get_list_id(conn, name: str) -> str:
    """Get list ID by name."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    query = "SELECT id FROM grocery_lists WHERE name = %s LIMIT 1"
    cursor.execute(query, (name,))
    result = cursor.fetchone()
    cursor.close()
    if result:
        return result['id']
    raise Exception(f"List not found with name: {name}")

def create_sample_list_items(conn) -> None:
    """Create sample list items."""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, is_checked, created_by, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Get list IDs
    milk_list_id = get_list_id(conn, "Weekly Groceries")
    office_list_id = get_list_id(conn, "Office Essentials")
    admin_user_id = get_user_id_by_email(conn, "admin@shoplist.com")
    
    items = [
        (str(uuid.uuid4()), milk_list_id, "Milk", 2, 3.50, "Dairy", False, admin_user_id, datetime.now(timezone.utc) - timedelta(minutes=1)),
        (str(uuid.uuid4()), milk_list_id, "Bread", 1, 2.99, "Bakery", False, admin_user_id, datetime.now(timezone.utc) - timedelta(minutes=2)),
        (str(uuid.uuid4()), milk_list_id, "Eggs", 12, 4.50, "Dairy", True, admin_user_id, datetime.now(timezone.utc) - timedelta(minutes=3)),
        (str(uuid.uuid4()), office_list_id, "Coffee", 1, 12.00, "Beverages", False, admin_user_id, datetime.now(timezone.utc) - timedelta(minutes=1)),
        (str(uuid.uuid4()), office_list_id, "Coffee Filters", 2, 8.00, "Beverages", False, admin_user_id, datetime.now(timezone.utc) - timedelta(minutes=2)),
        (str(uuid.uuid4()), office_list_id, "Notebooks", 10, 1.50, "Stationery", False, admin_user_id, datetime.now(timezone.utc) - timedelta(minutes=1)),
    ]
    
    for item_id, list_id, name, quantity, unit_price, category, is_checked, created_by, created_at in items:
        cursor.execute(query, (item_id, list_id, name, quantity, unit_price, category, is_checked, created_by, created_at))
    
    conn.commit()
    cursor.close()
    print("  Created sample list items")

def main():
    parser = argparse.ArgumentParser(description='Seed database with sample data')
    parser.add_argument('--db-host', type=str, default='localhost', help='Database host')
    parser.add_argument('--db-port', type=int, default=5432, help='Database port')
    parser.add_argument('--db-name', type=str, default='grocerymind', help='Database name')
    parser.add_argument('--db-user', type=str, default='postgres', help='Database user')
    parser.add_argument('--db-password', type=str, default='', help='Database password')
    parser.add_argument('--no-confirm', action='store_true', help='Skip confirmation prompt')
    
    args = parser.parse_args()
    
    # Confirm
    if not args.no_confirm:
        print("\n" + "=" * 60)
        print("Seed Data Script")
        print("=" * 60)
        print("\nThis will create the following users:")
        print("  - admin@shoplist.com / Admin123!")
        print("  - test1@example.com / Test123!")
        print("  - test2@example.com / Test456!")
        print("\nThis will also create sample households and grocery lists.")
        print("=" * 60)
        confirm = input("Do you want to proceed? [N/y]: ")
        if confirm.lower() not in ['y', 'yes']:
            print("Seed data creation cancelled.")
            sys.exit(0)
    
    conn = get_db_connection()
    
    try:
        # Check if admin user already exists
        existing_users = get_all_users(conn)
        admin_exists = any(u['email'] == 'admin@shoplist.com' for u in existing_users)
        
        if not admin_exists:
            print("\nCreating admin user...")
            create_admin_user(conn)
            create_test_users(conn)
        else:
            print("\nAdmin user already exists. Skipping user creation.")
        
        # Check and create sample data
        print("\nChecking sample data...")
        
        # Check households
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM households")
        household_count = cursor.fetchone()[0]
        cursor.close()
        
        if household_count == 0:
            print("\nCreating sample households...")
            create_sample_households(conn)
        else:
            print(f"\nFound {household_count} households. Skipping household creation.")
        
        # Check lists
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM grocery_lists")
        list_count = cursor.fetchone()[0]
        cursor.close()
        
        if list_count == 0:
            print("\nCreating sample grocery lists...")
            create_sample_lists(conn)
        else:
            print(f"\nFound {list_count} lists. Skipping list creation.")
        
        # Check list items
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM list_items")
        item_count = cursor.fetchone()[0]
        cursor.close()
        
        if item_count == 0:
            print("\nCreating sample list items...")
            create_sample_list_items(conn)
        else:
            print(f"\nFound {item_count} list items. Skipping item creation.")
        
        # Summary
        print("\n" + "=" * 60)
        print("Seed data complete!")
        print("=" * 60)
        print("\nLogin credentials:")
        print("  Email: admin@shoplist.com   Password: Admin123!")
        print("  Email: test1@example.com    Password: Test123!")
        print("  Email: test2@example.com    Password: Test456!")
        print("=" * 60)
        
    finally:
        conn.close()
        print("\nDatabase connection closed.")

if __name__ == '__main__':
    main()
