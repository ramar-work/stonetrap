# readme.md

So... this is kind of both a readme and a TODO.  There are so many things I'm
probably doing wrong, but getting it done is primary concern.


# Getting the game working

User should see the main screen and either start a new game or pick up an old one with a PIN (4-5 digit code).

## The Aim

You'll be challenged to rearrange a certain image according to a hint.  It's probably going to need to be done
under a certain time limit.

## Controls

The user can click a box and watch it rotate into shape.  They can also move the board around if it's too small.


# Getting the Game Working from a Developer's Perspective

Both files/ and assets/img/ contain parts of the levels (for now).  
assets/img/levels/l[X] contains the images needed for a particular level.
files/levels/l[X] contains metadata and password files.  The backend will
either find the requested level folder or it won't, and die out.  The user
shouldn't really see any of this.  Either they'll get a 404 or a confused
looking man/woman/man-woman saying that they can't find the level in question.

## Controls (for Developers)

Devs can play with the x/y/z-orientation of the board to debug things.
