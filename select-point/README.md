The select point question type (QTI *select point*) shows an image on which students click the right spot, like a country on a map or a part of a diagram.

## When to use it

- Topography: point out a city, country or river on a map.
- Biology and physics: point out a part of a diagram.
- Any question where the answer is a place in a picture.

## How it works for students

Students click the image to place a point, and click a point to remove it. When the maximum number of points is reached, a new point replaces the earliest one.

## Grading

Scored automatically: the answer is correct when every area holds a point and no point is outside an area.

## Settings

| Setting | Description |
| --- | --- |
| Image | The image students click on. |
| Correct areas | Circles (or, from a QTI import, rectangles) students have to click. Click the image to add one, and an area to remove it. |
| Maximum number of points | How many points a student can place at most, 0 for no limit. |

Points and areas are stored in the image's coordinate space: the `width` and `height` settings when a QTI import declares them, or the image's own size. An answer stores each point as an `"x,y"` string.
