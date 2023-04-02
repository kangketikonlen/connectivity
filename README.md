# Connectivity Monitor
This code defines several functions to update and display the connectivity status of multiple servers. It retrieves data from a server, sorts the servers by name, and displays the connectivity status of each server in a container. The connectivity status is updated every 10 seconds. The code uses JavaScript's async/await syntax for handling asynchronous operations, and it also includes a helper function to format a date string in a desired format.

# Code or function explanation
This code initializes some variables including the server URL, loading indicator, and containers for displaying connectivity data. It also contains three functions:
1. `convert_date()` - a function that converts a date string to a formatted string that displays the day, date, month, year, and time.
2. `fetchData()` - an asynchronous function that fetches data from the server URL and returns it as JSON.
3. `checkServerStatus()` - an asynchronous function that checks the status of a connection to a specific server.