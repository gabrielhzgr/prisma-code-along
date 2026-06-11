SELECT id, name, email
FROM "User" 
WHERE id = ANY ($1)