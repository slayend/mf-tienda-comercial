export interface Producto {
  id: number;
  empresaId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  categoriaId: number;
  unidadMedida: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  activo: boolean;
  imagenUrl: string;
}

export interface CategoriaProducto {
  id: number;
  empresaId: number;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  orden: number;
  activa: boolean;
  padreId: number | null;
  visiblePos: boolean;
  visibleWeb: boolean;
  subcategorias: CategoriaProducto[];
}

export interface StockTienda {
  id: number;
  tiendaId: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
}

export interface MetodoPago {
  id: number;
  empresaId: number;
  nombre: string;
  tipo: string;
  activo: boolean;
  requiereReferencia: boolean;
}

export interface ConfiguracionWeb {
  id: number;
  empresaId: number;
  nombreTienda: string;
  logoUrl: string;
  colorPrimario: string;
  colorSecundario: string;
  activa: boolean;
  mostrarPrecios: boolean;
  permitirCompras: boolean;
}

export interface PedidoWebRequest {
  empresaId: number;
  clienteId: number | null;
  metodoPagoId: number;
  estado: string;
  notas?: string;
  direccionEnvio: string;
  detalles: DetallePedidoWebRequest[];
}

export interface DetallePedidoWebRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
}

export interface PedidoWebResponse {
  id: number;
  empresaId: number;
  numeroPedido: string;
  clienteId: number;
  clienteNombre: string;
  metodoPagoId: number;
  metodoPagoNombre: string;
  estado: string;
  subtotal: number;
  iva: number;
  total: number;
  notas: string;
  direccionEnvio: string;
  fechaCreacion: string;
  fechaPedido: string;
  fechaEntrega: string;
  detalles: DetallePedidoWebResponse[];
}

export interface DetallePedidoWebResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface ClienteRequest {
  empresaId: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface ClienteResponse {
  id: number;
  empresaId: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface WebPayInitRequest {
  ventaId: number;
  empresaId: number;
  monto: number;
  returnUrl: string;
}

export interface WebPayInitResponse {
  token: string;
  url: string;
  ventaId: number;
  message: string;
}

export interface WebPayConfirmResponse {
  token: string;
  status: string;
  message: string;
}
