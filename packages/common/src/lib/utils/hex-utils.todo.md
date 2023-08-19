# Neighbours

## Cubic

```
var cube_direction_vectors = [
    Cube(+1, 0, -1), Cube(+1, -1, 0), Cube(0, -1, +1), 
    Cube(-1, 0, +1), Cube(-1, +1, 0), Cube(0, +1, -1), 
]

function cube_direction(direction):
    return cube_direction_vectors[direction]

function cube_add(hex, vec):
    return Cube(hex.q + vec.q, hex.r + vec.r, hex.s + vec.s)

function cube_neighbor(cube, direction):
    return cube_add(cube, cube_direction(direction))
```

## Axial

```
var axial_direction_vectors = [
    Hex(+1, 0), Hex(+1, -1), Hex(0, -1), 
    Hex(-1, 0), Hex(-1, +1), Hex(0, +1), 
]

function axial_direction(direction):
    return axial_direction_vectors[direction]

function axial_add(hex, vec):
    return Hex(hex.q + vec.q, hex.r + vec.r)

function axial_neighbor(hex, direction):
    return axial_add(hex, axial_direction(direction))
```

## Diagonal

```
var cube_diagonal_vectors = [
    Cube(+2, -1, -1), Cube(+1, -2, +1), Cube(-1, -1, +2), 
    Cube(-2, +1, +1), Cube(-1, +2, -1), Cube(+1, +1, -2), 
]

function cube_diagonal_neighbor(cube, direction):
    return cube_add(cube, cube_diagonal_vectors[direction])
```

# Hex range

## Cubic

```
var results = []
for each -N ≤ q ≤ +N:
    for each max(-N, -q-N) ≤ r ≤ min(+N, -q+N):
        var s = -q-r
        results.append(cube_add(center, Cube(q, r, s)))
```

## Axial

```
var results = []
for each -N ≤ q ≤ +N:
    for each max(-N, -q-N) ≤ r ≤ min(+N, -q+N):
        results.append(axial_add(center, Hex(q, r)))
```

# Intersecting ranges

```
var results = []
for each qmin ≤ q ≤ qmax:
    for each max(rmin, -q-smax) ≤ r ≤ min(rmax, -q-smin):
        results.append(Hex(q, r))
```

# Obstacles

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

# Rings

## Single ring

```
function cube_scale(hex, factor):
    return Cube(hex.q * factor, hex.r * factor, hex.s * factor)

function cube_ring(center, radius):
    var results = []
    # this code doesn't work for radius == 0; can you see why?
    var hex = cube_add(center,
                        cube_scale(cube_direction(4), radius))
    for each 0 ≤ i < 6:
        for each 0 ≤ j < radius:
            results.append(hex)
            hex = cube_neighbor(hex, i)
    return results
```

## Spiral rings

```
function cube_spiral(center, radius):
    var results = list(center)
    for each 1 ≤ k ≤ N:
        results = list_append(results, cube_ring(center, k))
    return results
```

# Field of view

https://www.redblobgames.com/grids/hexagons/#field-of-view
https://github.com/jbochi/duelo/blob/master/fov.js
https://s3.amazonaws.com/jbochi/layout.html
https://www.redblobgames.com/articles/visibility/

# Hex to pixel

```
function flat_hex_to_pixel(hex):
    var x = size * (     3./2 * hex.q                    )
    var y = size * (sqrt(3)/2 * hex.q  +  sqrt(3) * hex.r)
    return Point(x, y)
```

# Pixel to hex

```
function pixel_to_flat_hex(point):
    var q = ( 2./3 * point.x                        ) / size
    var r = (-1./3 * point.x  +  sqrt(3)/3 * point.y) / size
    return axial_round(Hex(q, r))
```

# Rounding to nearest nex

## Cubic

```
function cube_round(frac):
    var q = round(frac.q)
    var r = round(frac.r)
    var s = round(frac.s)

    var q_diff = abs(q - frac.q)
    var r_diff = abs(r - frac.r)
    var s_diff = abs(s - frac.s)

    if q_diff > r_diff and q_diff > s_diff:
        q = -r-s
    else if r_diff > s_diff:
        r = -q-s
    else:
        s = -q-r

    return Cube(q, r, s)
```

## Axial

```
function axial_round(hex):
    return cube_to_axial(cube_round(axial_to_cube(hex)))
```

# Pathfinding

https://www.redblobgames.com/grids/hexagons/#pathfinding
https://www.redblobgames.com/pathfinding/a-star/introduction.html