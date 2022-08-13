# Genetic-Flappy

Watch as an agent controlled by A.I. learns to play the side-scroller game "Flappy Bird". Play alongside the computer and see how many generations it takes until the A.I. can outperform a human! 

**This version is a much more difficult version of the original game**. This is in an attempt to push the A.I. to its limits, if you don't want to wait, you can spawn an agent I trained for 100 generations previously.


I made this teach myself and others more about genetic algorithms and neural networks. I don't think there are enough good playable games with visualizations out there for neural networks so I created this. I personally enjoy seeing how far genetic algorithms can evolve so I made something for myself to play around with and share that with others.

# Algorithm
This is a genetic algorithm which operates in the same way as natural selection on Earth.

There are 3 main steps to the process of evolution each generation:
1. Selection - select the most fit members of the population (the members which flew the farthest in this case)
2. Crossover - combine the brains of two fit parents to create offspring
3. Mutation - alter the brains of each member of the population slightly in hopes a beneficial change will arise
