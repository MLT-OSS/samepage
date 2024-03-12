alter table t_conversation_info add column  IF NOT EXISTS `collected` varchar(10) default '0' COMMENT '会话是否被收藏，1已收藏，0未收藏，对应Constants.COMMON_YES和Constants.COMMON_NO';
