from flask import Flask, request, jsonify
import mysql.connector

# Security considerations:
# - Replace with secure environment variables, not directly in code.
# - Consider using a secrets manager for sensitive data.
import os

MYSQL_HOST = os.environ.get('MYSQL_HOST')
MYSQL_USER = os.environ.get('MYSQL_USER')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD')
MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE')

app = Flask(__name__)

# Connect to MySQL database (replace with your own connection logic)
try:
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE,
    )
except mysql.connector.Error as err:
    print("Error connecting to database:", err)
    exit(1)

@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        data = request.get_json()
        expression = data["expression"]

        # Use a safe math parser library instead of eval
        # (e.g., sympy, mathparser) for security and expression validation
        # Replace with your chosen parser:
        result = eval(expression)  # Placeholder for safe parser

        # Create a cursor object (assuming table exists)
        cursor = connection.cursor()

        # Insert calculation history into MySQL table
        sql = "INSERT INTO history (expression, result) VALUES (%s, %s)"
        data = (expression, result)
        cursor.execute(sql, data)
        connection.commit()

        # Close the cursor
        cursor.close()

        return jsonify({"result": result})

    except Exception as e:
        # Handle exceptions gracefully
        if isinstance(e, SyntaxError):
            error_message = "Invalid expression format."
        else:
            error_message = "An error occurred during calculation."
        return jsonify({"error": error_message}), 400  # Bad Request

@app.route("/history", methods=["GET"])
def get_history():
    try:
        # Create a cursor object (assuming table exists)
        cursor = connection.cursor()

        # Retrieve calculation history from MySQL table
        sql = "SELECT * FROM history"
        cursor.execute(sql)
        history = cursor.fetchall()

        # Close the cursor
        cursor.close()

        return jsonify({"history": history})

    except mysql.connector.Error as err:
        print("Error retrieving history:", err)
        return jsonify({"error": "Error retrieving history"}), 500  # Internal Server Error

if __name__ == "__main__":
    app.run(debug=True)
