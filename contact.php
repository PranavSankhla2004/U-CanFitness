<?php
// contact.php - U-Can Fitness Studio Contact Form Handler

// Set content type for JSON response
header('Content-Type: application/json');

// Allow CORS (Cross-Origin Resource Sharing) if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Initialize response array
$response = array();

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['success'] = false;
    $response['message'] = 'Invalid request method. Please use POST.';
    echo json_encode($response);
    exit;
}

// Sanitize and validate input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Get form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$service = isset($_POST['service']) ? sanitizeInput($_POST['service']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validate required fields
$errors = array();

if (empty($name)) {
    $errors[] = 'Name is required.';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required.';
}

if (empty($service)) {
    $errors[] = 'Please select a service.';
}

// Validate phone number format
if (!empty($phone)) {
    $phone_clean = preg_replace('/[^0-9+]/', '', $phone);
    if (strlen($phone_clean) < 10 || strlen($phone_clean) > 15) {
        $errors[] = 'Please enter a valid phone number.';
    }
}

// Validate name (letters and spaces only)
if (!empty($name) && !preg_match("/^[a-zA-Z\s]+$/", $name)) {
    $errors[] = 'Name should contain only letters and spaces.';
}

// If there are validation errors
if (!empty($errors)) {
    $response['success'] = false;
    $response['message'] = implode(' ', $errors);
    echo json_encode($response);
    exit;
}

// Email configuration
$to_email = 'info@ucanfitnessstudio.com'; // Change this to your actual email
$subject = 'New Inquiry from U-Can Fitness Studio Website';

// Create email content
$email_body = "New fitness inquiry from website:\n\n";
$email_body .= "Name: " . $name . "\n";
$email_body .= "Phone: " . $phone . "\n";
$email_body .= "Service Interest: " . getServiceName($service) . "\n";

if (!empty($message)) {
    $email_body .= "Message: " . $message . "\n";
}

$email_body .= "\nDate: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n";

// Email headers
$headers = "From: website@ucanfitnessstudio.com\r\n";
$headers .= "Reply-To: " . $to_email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Try to send email
$mail_sent = false;
try {
    if (function_exists('mail')) {
        $mail_sent = mail($to_email, $subject, $email_body, $headers);
    }
} catch (Exception $e) {
    // Log error but don't expose to user
    error_log("Email sending failed: " . $e->getMessage());
}

// Log the inquiry to a file (backup method)
$log_data = array(
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'phone' => $phone,
    'service' => $service,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT']
);

// Create logs directory if it doesn't exist
if (!is_dir('logs')) {
    mkdir('logs', 0755, true);
}

// Save to log file
$log_file = 'logs/inquiries_' . date('Y-m') . '.txt';
$log_entry = date('Y-m-d H:i:s') . " | " . json_encode($log_data) . "\n";
file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);

// Prepare response
$response['success'] = true;
$response['message'] = 'Thank you for your inquiry! We will contact you soon.';

// Add WhatsApp integration data
$whatsapp_message = createWhatsAppMessage($name, $phone, $service, $message);
$response['whatsapp_url'] = 'https://wa.me/918209490538?text=' . urlencode($whatsapp_message);

// Send JSON response
echo json_encode($response);

// Helper function to get service display name
function getServiceName($serviceValue) {
    $serviceNames = array(
        'trampoline' => 'Trampoline Zumba',
        'zumba' => 'Zumba Fitness',
        'hiit' => 'HIIT Training',
        'aerobics' => 'Aerobics',
        'yoga' => 'Power Yoga',
        'meditation' => 'Meditation',
        'all' => 'All Programs'
    );

    return isset($serviceNames[$serviceValue]) ? $serviceNames[$serviceValue] : $serviceValue;
}

// Helper function to create WhatsApp message
function createWhatsAppMessage($name, $phone, $service, $message) {
    $whatsapp_text = "Hi! I'm interested in joining U-Can Fitness Studio.\n\n";
    $whatsapp_text .= "Name: " . $name . "\n";
    $whatsapp_text .= "Phone: " . $phone . "\n";
    $whatsapp_text .= "Interested in: " . getServiceName($service) . "\n";

    if (!empty($message)) {
        $whatsapp_text .= "Message: " . $message . "\n";
    }

    $whatsapp_text .= "\nPlease contact me for more information about classes and schedules.";

    return $whatsapp_text;
}

// Rate limiting (basic protection)
session_start();

// Check if user has submitted recently (within 1 minute)
$last_submission = isset($_SESSION['last_submission']) ? $_SESSION['last_submission'] : 0;
$current_time = time();

if (($current_time - $last_submission) < 60) {
    $response['success'] = false;
    $response['message'] = 'Please wait a minute before submitting another inquiry.';
    echo json_encode($response);
    exit;
}

// Update last submission time
$_SESSION['last_submission'] = $current_time;

// Additional security measures
function detectSpam($name, $message) {
    $spam_keywords = array('viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money');
    $text_to_check = strtolower($name . ' ' . $message);

    foreach ($spam_keywords as $keyword) {
        if (strpos($text_to_check, $keyword) !== false) {
            return true;
        }
    }

    return false;
}

// Check for spam
if (detectSpam($name, $message)) {
    $response['success'] = false;
    $response['message'] = 'Your message has been flagged. Please contact us directly.';
    echo json_encode($response);
    exit;
}

// Log successful submission
error_log("Successful form submission from: " . $name . " (" . $phone . ")");
?>