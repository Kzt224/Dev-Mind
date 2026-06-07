
export class ProjectResDto {

    permission!: {
        isOwner: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canAdd: boolean;
    };
}