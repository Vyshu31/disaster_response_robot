#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>

class LidarFrameRepublisher : public rclcpp::Node
{
public:
    LidarFrameRepublisher()
        : Node("lidar_frame_republisher")
    {
        publisher_ = this->create_publisher<sensor_msgs::msg::LaserScan>(
            "/scan", 10);

        subscription_ = this->create_subscription<sensor_msgs::msg::LaserScan>(
            "/lidar", 10,
            std::bind(
                &LidarFrameRepublisher::lidar_callback,
                this,
                std::placeholders::_1));
    }

private:
    void lidar_callback(
        const sensor_msgs::msg::LaserScan::SharedPtr msg)
    {
        auto corrected_msg = *msg;

        corrected_msg.header.frame_id = "lidar_link";

        publisher_->publish(corrected_msg);
    }

    rclcpp::Publisher<sensor_msgs::msg::LaserScan>::SharedPtr publisher_;
    rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr subscription_;
};

int main(int argc, char * argv[])
{
    rclcpp::init(argc, argv);

    auto node = std::make_shared<LidarFrameRepublisher>();

    rclcpp::spin(node);

    rclcpp::shutdown();

    return 0;
}
