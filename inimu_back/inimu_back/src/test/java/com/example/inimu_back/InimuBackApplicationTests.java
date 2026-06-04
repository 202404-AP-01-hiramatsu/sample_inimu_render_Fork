package com.example.inimu_back;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import java.net.HttpURLConnection;
import java.net.URL;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class InimuBackApplicationTests {

	@LocalServerPort
	private int port;

	@Test
	void contextLoads() {
	}

	@Test
	void rootRedirectsToTodo() throws Exception {
		HttpURLConnection connection = (HttpURLConnection) new URL("http://localhost:" + port + "/").openConnection();
		connection.setInstanceFollowRedirects(false);
		connection.connect();
		assertEquals(302, connection.getResponseCode());
		assertEquals("http://localhost:" + port + "/todo", connection.getHeaderField("Location"));
	}

}
