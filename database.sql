create table admin
(
    id         int auto_increment
        primary key,
    name       varchar(255)                       not null comment '管理员名字',
    phone      varchar(255)                       not null comment '管理员手机号',
    password   varchar(255)                       not null comment '密码',
    status     int      default 1                 null comment '状态：-1(停用)，0(删除)，1(正常)',
    head_img   varchar(255)                       not null comment '头像',
    role       int      default 0                 not null comment '角色：0(管理员)，1(超级管理员)',
    remark     varchar(255)                       null comment '备注',
    created_at datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间'
)
    engine = InnoDB;

create table chat_session
(
    id              int auto_increment comment '信息编号'
        primary key,
    sender_id       varchar(255)                       not null comment '发送者id',
    receiver_id     varchar(255)                       not null comment '接收者id',
    is_online       int      default 0                 not null comment '发送者是否在线：0(不在线)，1(在线)',
    is_last         int      default 0                 not null comment 'sender 和 receiver 之间该会话是否是最新：0(否)，1(是)',
    unread          int      default 0                 not null comment '发送者消息未读数',
    created_at      datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at      datetime default CURRENT_TIMESTAMP not null comment '更新时间',
    del_by_sender   int      default 1                 not null comment '该聊天会话是否被sender删除：0(已删除)，1(正常)',
    del_by_receiver int      default 1                 not null comment '该聊天会话是否被receiver删除：0(已删除)，1(正常)'
)
    engine = InnoDB;

create table chat_message
(
    id              int auto_increment
        primary key,
    session_id      int                                not null comment '会话的id',
    sender_id       varchar(255)                       not null comment '该条信息的发送者id',
    receiver_id     varchar(255)                       not null comment '接收者id',
    content         varchar(255)                       not null comment '聊天内容',
    type            int      default 1                 not null comment '消息类型：1(文字)，2(图片)，3(视频)',
    created_at      datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at      datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    del_by_sender   int      default 1                 not null comment '该消息是否被发送者删除：0(删除)，1(未删除)',
    del_by_receiver int      default 1                 not null comment '该消息是否被接收者删除：0(删除)，1(未删除)',
    constraint FK_c296b04bfe576bed3d1da68d15f
        foreign key (session_id) references chat_session (id)
)
    engine = InnoDB;

create index chat_detail_chat_list_id_fk
    on chat_message (session_id);

create table complaint
(
    id           int auto_increment
        primary key,
    complaint_id int                                not null comment '投诉人id',
    identity     int                                null comment '投诉人身份：1(租客)，2(房东)',
    reason       varchar(255)                       not null comment '投诉原因',
    image        varchar(255)                       not null comment '投诉图片地址',
    video        varchar(255)                       not null comment '投诉视频地址',
    status       int      default -1                not null comment '状态：-1(未处理)，0(删除)，1(已处理)',
    created_at   datetime default CURRENT_TIMESTAMP not null,
    updated_at   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    phone        varchar(255)                       not null comment '手机号'
)
    engine = InnoDB;

create table house_address
(
    id            int auto_increment
        primary key,
    province_name varchar(255)                       not null comment '省名称',
    city_name     varchar(255)                       not null comment '市名称',
    area_name     varchar(255)                       not null comment '区/县名称',
    address_name  varchar(255)                       not null comment '地址名称',
    address_info  varchar(255)                       not null comment '详细地址',
    latitude      double(20, 16)                     not null comment '纬度',
    longitude     double(20, 16)                     not null comment '经度',
    created_at    datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间'
)
    engine = InnoDB;

create table landlord
(
    id         int auto_increment
        primary key,
    name       varchar(255)                       not null comment '房东名称',
    phone      varchar(255)                       not null comment '房东手机',
    head_img   varchar(255)                       null comment '房东头像',
    status     int      default 1                 not null comment '状态：-1(停用)，0(删除)，1(正常)',
    remark     varchar(255)                       null comment '备注',
    created_at datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    password   varchar(255)                       null comment '房东密码'
)
    engine = InnoDB;

create table house
(
    id              int auto_increment
        primary key,
    landlord_id     int                                not null comment '房东id',
    address_id      int                                not null comment '地址id',
    name            varchar(255)                       not null comment '房屋名称',
    area            int                                not null comment '面积',
    price           int                                not null comment '租金',
    deposit_number  int                                not null comment '押金月数',
    price_number    int                                not null comment '每次付月数',
    floor           int                                not null comment '楼层',
    toward          int                                not null comment '朝向：1(东)，2(西)，3(南)，4(北)',
    toilet          int                                not null comment '卫生间：0(没有)，1(独立)，2(公用)',
    kitchen         int                                not null comment '厨房：0(没有)，1(独立)，2(公用)',
    balcony         int                                not null comment '阳台 ：1(有)，0(没有)',
    water_fee       double(3, 2)                       not null comment '水费',
    electricity_fee double(3, 2)                       not null comment '电费',
    internet_fee    int                                not null comment '网费',
    fuel_fee        int                                not null comment '燃气费',
    note            varchar(255)                       null comment '备注',
    house_img       varchar(510)                       not null comment '房屋图片',
    status          int      default -1                not null comment '状态 ：-1(待租未发布)，0(删除)，1(已租)，2(待租已发布)',
    created_at      datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at      datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint FK_30933010e4d8e01a24d917a7623
        foreign key (landlord_id) references landlord (id),
    constraint FK_bdaf522ac29259a0c919f39e4ca
        foreign key (address_id) references house_address (id)
)
    engine = InnoDB;

create index house_house_address_id_fk
    on house (address_id);

create index house_landlord_id_fk
    on house (landlord_id);

create table tenant
(
    id         int auto_increment
        primary key,
    name       varchar(255)                       not null comment '租客名称',
    phone      varchar(255)                       not null comment '租客手机',
    password   varchar(255)                       null comment '租客密码',
    head_img   varchar(255)                       null comment '租客头像',
    status     int      default 1                 not null comment '状态：-1(停用)，0(删除)，1(正常)',
    remark     varchar(255)                       null comment '备注',
    created_at datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间'
)
    engine = InnoDB;

create table house_collect
(
    id          int auto_increment
        primary key,
    house_id    int                                not null comment '房屋id',
    landlord_id int                                not null comment '房东id',
    tenant_id   int                                not null comment '租客id',
    status      int      default 0                 not null comment '状态：0(未收藏)，1(收藏)',
    created_at  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint FK_12a5898e165b866e3a39d2f05e6
        foreign key (house_id) references house (id),
    constraint FK_193fbcf6c07faa9d9e9957a004a
        foreign key (tenant_id) references tenant (id),
    constraint FK_8e4f9a5d240018464cb59288935
        foreign key (landlord_id) references landlord (id)
)
    engine = InnoDB;

create index house_collect_house_id_fk
    on house_collect (house_id);

create index house_collect_landlord_id_fk
    on house_collect (landlord_id);

create index house_collect_tenant_id_fk
    on house_collect (tenant_id);

create table house_lease
(
    id          int auto_increment
        primary key,
    house_id    int                                not null comment '房屋id',
    landlord_id int                                not null comment '房东id',
    tenant_id   int                                not null comment '租客id',
    status      int      default -1                not null comment '状态：-1(未处理)，0(已驳回)，1(已通过->已租赁)，2(已退租)',
    created_at  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint FK_52dc616ba005e371d3ce4fbdc1f
        foreign key (tenant_id) references tenant (id),
    constraint FK_c430279e4b96fd85957a5071d23
        foreign key (house_id) references house (id),
    constraint FK_dba42d7a3973d6ec2393d836e5b
        foreign key (landlord_id) references landlord (id)
)
    engine = InnoDB;

create table house_comment
(
    id             int auto_increment
        primary key,
    house_id       int                                not null comment '房屋id',
    landlord_id    int                                not null comment '房东id',
    tenant_id      int                                not null comment '租客id',
    lease_id       int                                not null comment '租赁id',
    house_score    int                                not null comment '房屋评分',
    landlord_score int                                not null comment '房东评分',
    comment        varchar(255)                       null comment '文字评价',
    image          varchar(255)                       null comment '图片',
    created_at     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    status         int      default 1                 not null comment '状态：0(删除)，1(正常)',
    constraint FK_03e94cde8e91dac56ca9f52699e
        foreign key (tenant_id) references tenant (id),
    constraint FK_3649d57c52f029d5f5ea55adb4c
        foreign key (landlord_id) references landlord (id),
    constraint FK_598298a59c3b90ea0d46774cf66
        foreign key (house_id) references house (id),
    constraint FK_f46f1e41c748b1c5b62c7b14884
        foreign key (lease_id) references house_lease (id)
)
    engine = InnoDB;

create index house_comment_house_id_fk
    on house_comment (house_id);

create index house_comment_house_lease_id_fk
    on house_comment (lease_id);

create index house_comment_landlord_id_fk
    on house_comment (landlord_id);

create index house_comment_tenant_id_fk
    on house_comment (tenant_id);

create index house_lease_house_id_fk
    on house_lease (house_id);

create index house_lease_landlord_id_fk
    on house_lease (landlord_id);

create index house_lease_tenant_id_fk
    on house_lease (tenant_id);

create table house_report
(
    id          int auto_increment
        primary key,
    house_id    int                                not null comment '房屋id',
    landlord_id int                                not null comment '房东id',
    tenant_id   int                                not null comment '租客id',
    reason      varchar(255)                       not null comment '报修原因',
    image       varchar(255)                       null comment '图片',
    video       varchar(255)                       null comment '视频',
    status      int      default 0                 null comment '状态：0(未处理)，1(已处理)',
    created_at  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint FK_5c991b472c465f7f5653b53e66b
        foreign key (house_id) references house (id),
    constraint FK_d71d755246ae833f020b9b5483f
        foreign key (tenant_id) references tenant (id),
    constraint FK_edde454d1680622cc650a7528bc
        foreign key (landlord_id) references landlord (id)
)
    engine = InnoDB;

create index house_report_house_id_fk
    on house_report (house_id);

create index house_report_landlord_id_fk
    on house_report (landlord_id);

create index house_report_tenant_id_fk
    on house_report (tenant_id);


