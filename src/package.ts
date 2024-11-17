interface Activity {
  time: Date;
  description: string;
  location: string;
}

interface Package {
  deliveryDate?: Date;
  delivered: boolean;
  activity: Activity[];
}

export default Package;
