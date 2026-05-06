"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrainingSessionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_training_session_dto_1 = require("./create-training-session.dto");
class UpdateTrainingSessionDto extends (0, mapped_types_1.PartialType)(create_training_session_dto_1.CreateTrainingSessionDto) {
}
exports.UpdateTrainingSessionDto = UpdateTrainingSessionDto;
//# sourceMappingURL=update-training-session.dto.js.map