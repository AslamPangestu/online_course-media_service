import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity("medias")
export default class Media {
    @PrimaryColumn("text", { name: 'xata_id', default: `('rec_'::text || (xata_private.xid())::text)` })
    id!: string

    @Column("varchar", { name: "image_path", length: 255 })
    imagePath!: string


    @Column("timestamptz", { name: "created_at", default: 'now()' })
    createdAt!: string


    @Column("timestamptz", { name: "updated_at", default: 'now()' })
    updatedAt!: string
}