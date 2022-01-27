# Image Overlay
The web-app lets the user to trasform the image to overlay on the 3D model. 

Load the url on the browser:[Github Page](https://monikatamsoy.github.io/effective-enigma/) and follow below events to transform the image: 
- Translate: 
  - Mouse Events
    - click on the image to activate, move the mouse to translate the image, click again to deactivate and leave the image
    - for moving in Z axis press 'f' key for going far and 'n' for getting near
    - alternatively, use dat.GUI controls to change image distance in Z axis
  - Touch Events(for portable devices)
    - touch and move to reposition the image
- Scale:
  - pinch on the trackpad to scale the image
  - alternatively use dat.GUI to scale in X and Y axes
- Rotate:
  - Press '1' and '0' to rotate in positive and negative Z axis
  - use dat.GUI controls to rotate the image

Click on the green button to start an immersive AR session. <br/>
AR touch gestures:
- touch and move to reposition the image
- pinch to scale
- rotate two fingers touch to rotate the image
- single tap to move far(negative z)
- double tap to move near(positive z)
 
Here is a demo of the AR session on a OnePlus 7T mobile device: 

https://user-images.githubusercontent.com/30457975/151306286-2bc1427f-52cd-4c70-a1da-6cab4c87ec03.mp4

