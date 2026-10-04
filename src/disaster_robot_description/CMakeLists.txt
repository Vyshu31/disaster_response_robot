cmake_minimum_required(VERSION 3.8)
project(disaster_robot_description)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(sensor_msgs REQUIRED)

add_executable(lidar_frame_republisher
  src/lidar_frame_republisher.cpp
)

target_link_libraries(lidar_frame_republisher
  rclcpp::rclcpp
  sensor_msgs::sensor_msgs
)

install(TARGETS
  lidar_frame_republisher
  DESTINATION lib/${PROJECT_NAME}
)

install(
  DIRECTORY
    urdf
    meshes
    rviz
    config
    launch
    worlds
  DESTINATION
    share/${PROJECT_NAME}
)

ament_package()
