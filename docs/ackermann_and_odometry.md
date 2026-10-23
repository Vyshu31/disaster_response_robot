# Ackermann Controller and Wheel Odometry

Project: Cloud Integrated Multi-Robot Disaster Response System
Robot: Ackermann-steering UGV
ROS 2 Distribution: Lyrical
Simulator: Gazebo

## 1. Source ROS 2 Environment

Run in each new terminal:

    source /opt/ros/lyrical/setup.bash
    source ~/disaster_response_robot/install/setup.bash

## 2. Check Controller Status

    ros2 control list_controllers

The ackermann_controller should be active before sending movement commands.

If it is already loaded but inactive, check its state before activating it.

    ros2 control set_controller_state ackermann_controller inactive
    ros2 control set_controller_state ackermann_controller active

Do not spawn the controller again if it is already loaded.

## 3. Spawn the Controller If Not Loaded

Run in a separate terminal:

    source /opt/ros/lyrical/setup.bash
    source ~/disaster_response_robot/install/setup.bash

    ros2 run controller_manager spawner ackermann_controller \
      --param-file ~/disaster_response_robot/install/disaster_robot_description/share/disaster_robot_description/config/ackermann_controllers.yaml

## 4. Move the Robot Forward

Tested successfully in Gazebo.

    source /opt/ros/lyrical/setup.bash
    source ~/disaster_response_robot/install/setup.bash

    timeout 5 ros2 topic pub -r 10 \
      /ackermann_controller/reference \
      geometry_msgs/msg/TwistStamped \
      "{twist: {linear: {x: 0.2}, angular: {z: 0.0}}}"

This requests a forward velocity of 0.2 m/s for five seconds.

## 5. Turn While Moving

Tested successfully in Gazebo.

    source /opt/ros/lyrical/setup.bash
    source ~/disaster_response_robot/install/setup.bash

    timeout 3 ros2 topic pub -r 10 \
      /ackermann_controller/reference \
      geometry_msgs/msg/TwistStamped \
      "{twist: {linear: {x: 0.15}, angular: {z: 0.2}}}"

This requests forward movement with a nonzero angular velocity for three seconds.

## 6. Wheel Odometry

Correct odometry topic:

    /ackermann_controller/odometry

Message type:

    nav_msgs/msg/Odometry

Read one message:

    ros2 topic echo /ackermann_controller/odometry --once

Read continuously:

    ros2 topic echo /ackermann_controller/odometry

Check publishing rate:

    ros2 topic hz /ackermann_controller/odometry

Odometry provides the estimated pose and velocity of the robot.

The frames observed during testing were odom and base_link.

## 7. Inspect Controller Topics

    ros2 topic list | grep ackermann_controller

Important topics:

- /ackermann_controller/reference — movement command input
- /ackermann_controller/odometry — estimated robot motion
- /ackermann_controller/controller_state — controller state information

## 8. Troubleshooting

Check controller status:

    ros2 control list_controllers

Check odometry:

    ros2 topic info /ackermann_controller/odometry
    ros2 topic echo /ackermann_controller/odometry --once

Check the command topic:

    ros2 topic info /ackermann_controller/reference

If the robot does not move, confirm that Gazebo is running, the robot is spawned, and the controller is active.

## Important Notes

- Start Gazebo and spawn the robot before testing movement.
- Keep the required simulation and ROS 2 control processes running.
- The timeout commands stop publishing after their specified duration.
- Odometry estimates motion; it does not guarantee globally accurate positioning.
- Update this document if controller configuration or topic names change.
