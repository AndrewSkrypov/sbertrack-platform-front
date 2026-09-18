alter table submissions
    add constraint fk_submissions_case foreign key (case_id) references cases(id),
    add constraint fk_submissions_reflection foreign key (reflection_id) references reflections(id);
