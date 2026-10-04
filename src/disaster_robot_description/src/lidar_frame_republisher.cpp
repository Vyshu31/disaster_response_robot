#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <sensor_msgs/msg/camera_info.hpp>

class SensorFrameRepublisher : public rclcpp::Node
{
public:
    SensorFrameRepublisher()
        : Node("sensor_frame_republisher")
    {
        // LiDAR
        lidar_publisher_ =
            this->create_publisher<sensor_msgs::msg::LaserScan>(
                "/scan", 10);

        lidar_subscription_ =
            this->create_subscription<sensor_msgs::msg::LaserScan>(
                "/lidar", 10,
                std::bind(
                    &SensorFrameRepublisher::lidar_callback,
                    this,
                    std::placeholders::_1));

        // Camera image
        camera_publisher_ =
            this->create_publisher<sensor_msgs::msg::Image>(
                "/camera/image_raw", 10);

        camera_subscription_ =
            this->create_subscription<sensor_msgs::msg::Image>(
                "/camera", 10,
                std::bind(
                    &SensorFrameRepublisher::camera_callback,
                    this,
                    std::placeholders::_1));

        // Camera information
        camera_info_publisher_ =
            this->create_publisher<sensor_msgs::msg::CameraInfo>(
                "/camera/camera_info", 10);

        camera_info_subscription_ =
            this->create_subscription<sensor_msgs::msg::CameraInfo>(
                "/camera_info", 10,
                std::bind(
                    &SensorFrameRepublisher::camera_info_callback,
                    this,
                    std::placeholders::_1));
    }

private:

    void lidar_callback(
        const sensor_msgs::msg::LaserScan::SharedPtr msg)
    {
        auto corrected_msg = *msg;
        corrected_msg.header.frame_id = "lidar_link";

        lidar_publisher_->publish(corrected_msg);
    }

    void camera_callback(
        const sensor_msgs::msg::Image::SharedPtr msg)
    {
        auto corrected_msg = *msg;
        corrected_msg.header.frame_id = "camera_link";

        camera_publisher_->publish(corrected_msg);
    }

    void camera_info_callback(
        const sensor_msgs::msg::CameraInfo::SharedPtr msg)
    {
        auto corrected_msg = *msg;
        corrected_msg.header.frame_id = "camera_link";

        camera_info_publisher_->publish(corrected_msg);
    }

    rclcpp::Publisher<sensor_msgs::msg::LaserScan>::SharedPtr
        lidar_publisher_;

    rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr
        lidar_subscription_;

    rclcpp::Publisher<sensor_msgs::msg::Image>::SharedPtr
        camera_publisher_;

    rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr
        camera_subscription_;

    rclcpp::Publisher<sensor_msgs::msg::CameraInfo>::SharedPtr
        camera_info_publisher_;

    rclcpp::Subscription<sensor_msgs::msg::CameraInfo>::SharedPtr
        camera_info_subscription_;
};

int main(int argc, char * argv[])
{
    rclcpp::init(argc, argv);

    auto node = std::make_shared<SensorFrameRepublisher>();

    rclcpp::spin(node);

    rclcpp::shutdown();

    return 0;
}
