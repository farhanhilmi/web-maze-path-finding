package main

import (
	"fmt"
	"maze-path-finding/src/maze"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Point struct {
	X, Y int
}

func main() {
	r := gin.Default()

	configCors := cors.DefaultConfig()
	configCors.AllowAllOrigins = true

	r.Use(cors.New(configCors))

	// Serve HTML and JS files
	r.LoadHTMLFiles("index.html", "main.js")
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	// API endpoint for maze pathfinding
	r.POST("/findPath", func(c *gin.Context) {
		var request struct {
			Maze [][]string `json:"maze"`
		}
		if err := c.BindJSON(&request); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request: "})
			return
		}
		fmt.Println("request", request.Maze)

		// Find the start and exit points in the maze
		start, exit := maze.FindPoint(request.Maze, maze.START), maze.FindPoint(request.Maze, maze.EXIT)
		if start.X == -1 || exit.X == -1 {
			c.JSON(400, gin.H{"error": "Start or exit point not found"})
			return
		}

		// Find the shortest path using BFS
		path := maze.FindPathDFS(request.Maze, start, exit)

		if path != nil {
			fmt.Println("Path found:")
			maze.PrintMazeWithPath(request.Maze, path)
		} else {
			fmt.Println("No path found.")
			// c.JSON(400, gin.H{"error": "No path found"})
			// return
		}

		c.JSON(200, gin.H{"path": path})
	})

	r.Run(":8080")
}
