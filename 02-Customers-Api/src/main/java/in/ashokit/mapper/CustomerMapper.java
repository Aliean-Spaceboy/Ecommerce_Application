package com.ecomm.customer.mapper;

import org.modelmapper.ModelMapper;

import com.ecomm.customer.dto.CustomerDto;
import com.ecomm.customer.entities.CustomerEntity;

public class CustomerMapper {

	public static final ModelMapper mapper = new ModelMapper();

	// converting Entity to Dto
	public static CustomerDto convertToDto(CustomerEntity entity) {
		return mapper.map(entity, CustomerDto.class);
	}

	// converting Dto to Entity
	public static CustomerEntity convertToEntity(CustomerDto dto) {
		return mapper.map(dto, CustomerEntity.class);
	}

}
