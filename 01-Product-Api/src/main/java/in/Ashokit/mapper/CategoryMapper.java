package in.Ashokit.mapper;

import org.modelmapper.ModelMapper;


import in.Ashokit.dto.CatogoryDto;
import in.Ashokit.entity.CategoryEntity;


public class CategoryMapper 
{
	public static final ModelMapper mapper
	                  = new ModelMapper();
	
	//entitytodto
	public static CatogoryDto convertToDto (CategoryEntity entity)
	{
		return mapper.map(entity, CatogoryDto.class);
	}
	
	//dtotoentity
	public static CategoryEntity convertToEntity(CatogoryDto dto)
	{
		return mapper.map(dto, CategoryEntity.class);
	}
	

}
