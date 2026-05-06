"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProtocolDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_protocol_dto_1 = require("./create-protocol.dto");
class UpdateProtocolDto extends (0, mapped_types_1.PartialType)(create_protocol_dto_1.CreateProtocolDto) {
}
exports.UpdateProtocolDto = UpdateProtocolDto;
//# sourceMappingURL=update-protocol.dto.js.map