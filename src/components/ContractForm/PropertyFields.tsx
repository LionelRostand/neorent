
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  isBailContract: boolean;
  getAvailableProperties: () => any[];
  getAvailableRooms: () => string[];
  isColocatifContract: boolean;
  isDataLoading: boolean;
}

const PropertyFields = ({ 
  formData, 
  handleInputChange, 
  isBailContract, 
  getAvailableProperties,
  getAvailableRooms,
  isColocatifContract,
  isDataLoading
}: PropertyFieldsProps) => {
  return (
    <>
      {isBailContract && (
        <div>
          <Label htmlFor="property">Property</Label>
          <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isDataLoading ? "Loading..." : "Select a property"} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableProperties().map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isBailContract && (
        <div>
          <Label htmlFor="property">Property</Label>
          <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isDataLoading ? "Loading..." : "Select a property"} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableProperties().map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isColocatifContract && formData.property && (
        <div>
          <Label htmlFor="roomNumber">Room</Label>
          <Select value={formData.roomNumber} onValueChange={(value) => handleInputChange('roomNumber', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableRooms().map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default PropertyFields;
