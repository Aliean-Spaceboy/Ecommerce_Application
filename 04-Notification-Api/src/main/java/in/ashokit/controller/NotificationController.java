package in.ashokit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import in.ashokit.service.NotificationService;

@RestController
public class NotificationController {
	@Autowired
	private NotificationService notificationService;

	@GetMapping("/demo")
	public String demo() {
		notificationService.sendNotfication();
		return "Success";
	}

}
