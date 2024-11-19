interface Activity {
  time: Date;
  description: string;
  location: string;
}

export interface Package {
  deliveryDate?: Date;
  delivered: boolean;
  activity: Activity[];
}
