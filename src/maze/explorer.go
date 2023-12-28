package maze

import "fmt"

type Maze [][]string
type Point struct {
	X, Y int
}

const (
	START = "-"
	PATH  = "*"
	WALL  = "#"
	EXIT  = "+"
)

func FindPoint(maze Maze, value string) Point {
	for y := 0; y < len(maze); y++ {
		for x := 0; x < len(maze[y]); x++ {
			if maze[y][x] == value {
				return Point{x, y}
			}
		}
	}
	return Point{-1, -1}
}

func FindPathDFS(maze Maze, current Point, exit Point) []Point {
	if current == exit {
		return []Point{current}
	}

	if isOutOfBounds(current, maze) || maze[current.Y][current.X] == WALL {
		return nil
	}

	// Mark the current position as visited
	maze[current.Y][current.X] = "V"

	// Explore neighbors in a specific order (up, down, left, right)
	neighbors := []Point{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
	for _, neighbor := range neighbors {
		newX, newY := current.X+neighbor.X, current.Y+neighbor.Y
		next := Point{newX, newY}

		if isOutOfBounds(next, maze) || maze[next.Y][next.X] == "V" {
			continue
		}

		if path := FindPathDFS(maze, next, exit); path != nil {
			return append([]Point{current}, path...)
		}
	}

	return nil
}

func isOutOfBounds(p Point, maze Maze) bool {
	return p.X < 0 || p.X >= len(maze[0]) || p.Y < 0 || p.Y >= len(maze)
}

func PrintMazeWithPath(maze Maze, path []Point) {
	for y := 0; y < len(maze); y++ {
		for x := 0; x < len(maze[y]); x++ {
			if containsPoint(path, Point{x, y}) {
				fmt.Print("X ")
			} else {
				fmt.Print(maze[y][x] + " ")
			}
		}
		fmt.Println()
	}
}

func containsPoint(points []Point, p Point) bool {
	for _, point := range points {
		if point == p {
			return true
		}
	}
	return false
}
