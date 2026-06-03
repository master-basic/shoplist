#!/usr/bin/env python3
"""
Password Migration Script
=========================

This script helps migrate existing user passwords from bcrypt hashes to plaintext.

IMPORTANT SECURITY NOTICE:
- bcrypt is a one-way hash function. Hashes CANNOT be decrypted.
- If you don't know the original passwords, they cannot be recovered.
- This script is ONLY for seed data or if you have known passwords.

Usage:
    python migrate_passwords.py --db-host=localhost --db-port=5432 --db-name=grocerymind --db-user=postgres --db-password=postgres

Or with environment variables:
    export DB_HOST=localhost
    export DB_PORT=5432
    export DB_NAME=grocerymind
    export DB_USER=postgres
    export DB_PASSWORD=postgres
    python migrate_passwords.py

"""

import os
import sys
import argparse
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

try:
    import psycopg2
    from psycopg2 import sql, extras
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("Error: psycopg2 is required. Install with: pip install psycopg2-binary")
    sys.exit(1)

try:
    from bcrypt import hashpw, gensalt, checkpw
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

def get_all_users(conn) -> List[Dict[str, Any]]:
    """Get all users with their email and hashed password."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = sql.SQL("""
        SELECT id, email, password_hash, password_plaintext 
        FROM users 
        WHERE password_plaintext IS NULL 
        ORDER BY id
    """)
    
    cursor.execute(query)
    users = cursor.fetchall()
    cursor.close()
    
    return users

def update_user_password(conn: psycopg2.Connection, user_id: int, plaintext_password: str) -> bool:
    """Update a user's password_plaintext field."""
    cursor = conn.cursor()
    
    try:
        query = sql.SQL("""
            UPDATE users 
            SET password_plaintext = %s, password_hash = %s
            WHERE id = %s
        """)
        
        # Hash the plaintext password for password_hash field
        password_hash = hashpw(plaintext_password.encode('utf-8'), gensalt()).decode('utf-8')
        
        cursor.execute(query, (plaintext_password, password_hash, user_id))
        conn.commit()
        print(f"  Updated user {user_id} ({cursor.rowcount} row)")
        return True
    except psycopg2.Error as e:
        conn.rollback()
        print(f"  Error updating user {user_id}: {e}")
        return False
    finally:
        cursor.close()

def dry_run(conn, users: List[Dict[str, Any]]) -> None:
    """Print users that would be migrated without making changes."""
    print("\n=== DRY RUN: Users that would be migrated ===")
    for user in users:
        print(f"  User ID: {user['id']}, Email: {user['email']}")
        print(f"    Current hash: {user['password_hash'][:50]}...")
        print()

def migrate_users(conn, user_map: Dict[int, str]) -> int:
    """Migrate users with known passwords."""
    users = get_all_users(conn)
    
    if not users:
        print("No users found with hashed passwords (all already migrated or no users).")
        return 0
    
    print(f"\n=== Found {len(users)} users with hashed passwords ===\n")
    
    # Print dry run first
    dry_run(conn, users)
    
    # Ask for confirmation
    confirm = input("Do you want to proceed? (Enter passwords when prompted): [N/y] ")
    if confirm.lower() not in ['y', 'yes']:
        print("Migration cancelled.")
        return 0
    
    # Map of user_id -> plaintext_password
    user_map = user_map if user_map else {}
    
    # Migrate users
    migrated_count = 0
    for user in users:
        user_id = user['id']
        email = user['email']
        
        if user_id not in user_map:
            print(f"\nUser {user_id} ({email}): No plaintext password provided.")
            plaintext = user_map.get(user_id)
        else:
            plaintext = user_map[user_id]
            
            if not plaintext:
                print(f"\nUser {user_id} ({email}): Empty password - skipping")
                continue
            
            if update_user_password(conn, user_id, plaintext):
                migrated_count += 1
    
    print(f"\n=== Migration complete: {migrated_count} users migrated ===")
    return migrated_count

def main():
    parser = argparse.ArgumentParser(description='Migrate user passwords from hash to plaintext')
    parser.add_argument('--db-host', type=str, default='localhost', help='Database host')
    parser.add_argument('--db-port', type=int, default=5432, help='Database port')
    parser.add_argument('--db-name', type=str, default='grocerymind', help='Database name')
    parser.add_argument('--db-user', type=str, default='postgres', help='Database user')
    parser.add_argument('--db-password', type=str, default='', help='Database password')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be migrated without making changes')
    parser.add_argument('--all', action='store_true', help='Skip password prompts and wait for input')
    
    args = parser.parse_args()
    
    # Warn about security
    print("=" * 60)
    print("WARNING: Password Migration")
    print("=" * 60)
    print("bcrypt hashes CANNOT be decrypted. This script is for")
    print("seed data or known passwords only.")
    print("=" * 60)
    
    conn = get_db_connection()
    
    try:
        if args.dry_run:
            users = get_all_users(conn)
            dry_run(conn, users)
        else:
            migrate_users(conn, None)
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == '__main__':
    main()