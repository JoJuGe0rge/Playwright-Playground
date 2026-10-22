const price: number = 29.99;
function double(n: number) {
  return n * 2;
}
double(5);
type Product = {
  name: string;
  price: number;
  color: string;
};
const item: Product = {
  name: 'Sauce Labs Backpack',
  price: 29.99,
  color: 'black'
};
function findName(): string | null {
  return Math.random() > 0.5 ? 'Backpack' : null;
}
const maybeName = findName();
const shown = maybeName ?? 'none';




const bundle = { name: 'Backpack', price: 29.99, color: 'black' };

function describeOne(item: { name: string; price: number }) {
  return `${item.name} costing ${item.price}`;
}

function describeTwo({ name, price }: { name: string; price: number }) {
  return `${name} costs ${price}`;
}

console.log(describeOne(bundle));
console.log(describeTwo(bundle));

const scores: Array<number> = [10, 20, 'thirty']; // Error: 'thirty' is not a number