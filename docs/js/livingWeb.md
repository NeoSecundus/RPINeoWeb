# Living Web 
## Table of Content 

1. [LivingWeb](#livingweb)
2. [Node](#node) 

## LivingWeb
Starts the livingWeb loop on include. Nodes in background are dynamically generated depending on the size of the window.

#### nodeGen()
Creates nodes at random positions and random speeds. (Within set boundaries)

## Node
Connecting Node of the LivingWeb script. Nodes save all necessary data like position and speed.

#### drawPoint()
Draws the Node on the canvas

#### drawLines(nodes, drawRadius)
Draws lines to all neighboring `nodes` inside the given `drawRadius`.
Opacity of lines change with distance.

#### move()
Updates node position and checks for boundaries.
If boundaries are hit it "bounces" off.

