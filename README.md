# 4-in-a-row

A simplicistic implementation of 4-in-a-row/connect 4 in javascript with a bot
that uses the monte carlo tree search for its AI.

* Implemented with webworkers and canvas for rendering
* Monte carlo tree search
* Starting player is randomly selected

To win, place 4 of your stones in a horizontal, vertical or diagonal line.

## How does the AI work?

If it's the AIs turn, for every free column it simulates placing a stone in it 
and then continues to fill the board randomly 1000 times, until one player wins 
(adjustable in the "difficulty" setting). It then selects the column with the
best win/loss ratio.