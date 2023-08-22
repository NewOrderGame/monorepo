# Map / Cell

## Obstacles

```
function hex_reachable(start, movement):
    var visited = set() # set of hexes
    add start to visited
    var fringes = [] # array of arrays of hexes
    fringes.append([start])

    for each 1 < k ≤ movement:
        fringes.append([])
        for each hex in fringes[k-1]:
            for each 0 ≤ dir < 6:
                var neighbor = hex_neighbor(hex, dir)
                if neighbor not in visited and not blocked:
                    add neighbor to visited
                    fringes[k].append(neighbor)

    return visited
```

## Field of view

- https://www.redblobgames.com/grids/hexagons/#field-of-view
- https://github.com/jbochi/duelo/blob/master/fov.js
- https://s3.amazonaws.com/jbochi/layout.html
- https://www.redblobgames.com/articles/visibility/

## Pathfinding

- https://www.redblobgames.com/grids/hexagons/#pathfinding
- https://www.redblobgames.com/pathfinding/a-star/introduction.html

# Probably unnecessary

## Hex to pixel (?)

```
function flat_hex_to_pixel(hex):
    var x = size * (     3./2 * hex.q                    )
    var y = size * (sqrt(3)/2 * hex.q  +  sqrt(3) * hex.r)
    return Point(x, y)
```

## Pixel to hex (?)

```
function pixel_to_flat_hex(point):
    var q = ( 2./3 * point.x                        ) / size
    var r = (-1./3 * point.x  +  sqrt(3)/3 * point.y) / size
    return axial_round(Hex(q, r))
```
