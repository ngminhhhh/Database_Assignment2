#!/bin/bash

echo "Waiting for SQL Server to start..."
sleep 30s

echo "Running SQL scripts..."

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -C -i /sql-scripts/create_table.sql
echo "Tables created"

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -C -i /sql-scripts/function_procedure.sql
echo "Functions and Procedures created"

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -C -i /sql-scripts/trigger.sql
echo "Triggers created"

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -C -i /sql-scripts/insert_data.sql
echo "Data inserted"

echo "Database initialization completed!"
