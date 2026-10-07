package in.ashokit.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import in.ashokit.entities.CustomerEntity;

@DataJpaTest
@ActiveProfiles("test")
public class CustomerRepositoryIntegrationTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    public void testSaveAndFindByEmail() {
        CustomerEntity customer = new CustomerEntity();
        customer.setName("John Doe");
        customer.setEmail("john.doe@example.com");
        customer.setPassword("securePassword");
        
        customerRepository.save(customer);

        CustomerEntity foundCustomer = customerRepository.findByEmail("john.doe@example.com");
        
        assertNotNull(foundCustomer);
        assertEquals("John Doe", foundCustomer.getName());
    }
}
