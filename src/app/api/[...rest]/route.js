import { HandleResponse, methodNotFound } from '@api/route';

export async function GET(req) {
  return HandleResponse(methodNotFound);
}
export async function HEAD(req) {
  return HandleResponse(methodNotFound);
}
export async function POST(req) {
  return HandleResponse(methodNotFound);
}
export async function PUT(req) {
  return HandleResponse(methodNotFound);
}
export async function DELETE(req) {
  return HandleResponse(methodNotFound);
}
export async function PATCH(req) {
  return HandleResponse(methodNotFound);
}
export async function OPTIONS(req) {
  return HandleResponse(methodNotFound);
}
