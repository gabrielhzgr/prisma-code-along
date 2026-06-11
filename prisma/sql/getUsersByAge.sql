-- @param {Int} $1:minAge
-- @param {Int} $2:maxAge
SELECT id, name, age 
FROM "User" 
WHERE age > $1 AND age <$2