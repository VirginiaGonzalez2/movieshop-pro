
SELECT 
	g.name,
	COUNT(DISTINCT m.id) as total_movies
FROM "Genre" g
LEFT JOIN "MovieGenre" mg ON g.id = mg."genreId"
LEFT JOIN "Movie" m ON m.id = mg."movieId"
GROUP BY g.name
ORDER BY total_movies DESC;
