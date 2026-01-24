package in.Ashokit.mapper;

import org.modelmapper.ModelMapper;

import in.Ashokit.dto.ProductDto;
import in.Ashokit.entity.Product_Entity;

public class ProductMapper 
{
	public static final ModelMapper mapper =new 
			 ModelMapper();
	
	//entity to dto
	public static ProductDto convertToDto(Product_Entity entity)
	{
		return mapper.map(entity, ProductDto.class);
	}
    
	public static Product_Entity convertToEntity(ProductDto dto)
	{
		return mapper.map(dto, Product_Entity.class);
	}
}
