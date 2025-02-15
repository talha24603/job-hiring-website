import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function CategoryCard() {
  return (
    <Card className=" w-80 shadow-md rounded-xl overflow-hidden">
      <img 
        src="/images/image.jpg" 
        alt="Heirloom tomato" 
        className="w-full h-40 object-cover"
      />
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">Heirloom tomato</CardTitle>
        <p className="text-green-600 font-bold">$5.99 / lb</p>
        <p className="text-gray-500 text-sm">Grown in San Juan Capistrano, CA</p>
      </CardContent>
    </Card>
  );
}
