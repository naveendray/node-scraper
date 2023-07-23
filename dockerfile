# Use the official Apache image from Docker Hub
FROM httpd:latest

# Copy the contents of the my-website folder into the Apache web root directory (www)
COPY ./downloaded/ /usr/local/apache2/htdocs/

# Expose port 80 to access the Apache server
EXPOSE 80