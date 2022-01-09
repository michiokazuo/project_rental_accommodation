package com.project2.entities.data;

import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "motel_room")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MotelRoom extends Base {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "images", nullable = false)
    private String images;

    @ManyToOne
    @JoinColumn(name = "id_host", referencedColumnName = "id")
    private AppUser host;

    /**
     * m2
     */
    @Column(name = "area", nullable = false)
    private Integer area;

    @Column(name = "max_person", nullable = false)
    private Integer maxPerson;

    @Column(name = "floors")
    private Integer floors;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "location", nullable = false)
    private String location;

    /**
     * FK_CATEGORY
     */
    @ManyToOne
    @JoinColumn(name = "id_category", referencedColumnName = "id")
    private Category category;

    @Column(name = "priority_object")
    private String priorityObject;

    @Column(name = "history_price")
    private String historyPrice;
}
