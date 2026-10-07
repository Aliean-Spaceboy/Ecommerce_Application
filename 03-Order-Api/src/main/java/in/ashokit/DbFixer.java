package in.ashokit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DbFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            java.util.List<String> queries = jdbcTemplate.queryForList(
                "SELECT CONCAT('ALTER TABLE ', TABLE_NAME, ' DROP FOREIGN KEY ', CONSTRAINT_NAME, ';') " +
                "FROM information_schema.key_column_usage " +
                "WHERE REFERENCED_TABLE_NAME IN ('customer_entity', 'customers_entity') AND TABLE_SCHEMA = 'ecommerce'", 
                String.class
            );
            for (String query : queries) {
                jdbcTemplate.execute(query);
                System.out.println("Executed: " + query);
            }
        } catch (Exception e) {
            System.out.println("FK drop logic failed: " + e.getMessage());
        }
    }
}
