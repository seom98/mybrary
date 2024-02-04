package com.mybrary.backend.domain.rollingpaper.entity;

import com.mybrary.backend.domain.base.BaseEntity;
import com.mybrary.backend.domain.image.entity.Image;
import com.mybrary.backend.domain.mybrary.entity.Mybrary;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Where(clause = "is_deleted <> true")
@SQLDelete(sql = "UPDATE rolling_paper SET is_deleted = TRUE WHERE rolling_paper_id = ?")
public class RollingPaper extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rolling_paper_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mybrary_id")
    private Mybrary mybrary;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id")
    private Image rollingPaperImage;

}
