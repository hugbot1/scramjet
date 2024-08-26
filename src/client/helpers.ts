export function getOwnPropertyDescriptorHandler(target, prop) {
	let realDescriptor = Reflect.getOwnPropertyDescriptor(target, prop);
	if (!realDescriptor) return realDescriptor;

	let d: PropertyDescriptor = {};

	if (realDescriptor.enumerable !== undefined)
		d.enumerable = realDescriptor.enumerable;
	if (realDescriptor.configurable !== undefined)
		d.configurable = realDescriptor.configurable;
	if (realDescriptor.writable !== undefined)
		d.writable = realDescriptor.writable;

	if (realDescriptor.get) {
		d.get = () => this.get(target, prop);
	}

	if (realDescriptor.set) {
		d.set = (value) => this.set(target, prop, value);
	}

	if (realDescriptor.value) {
		d.value = this.get(target, prop);
	}
	return d;
}
