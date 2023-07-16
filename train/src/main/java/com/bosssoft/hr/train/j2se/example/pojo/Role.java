package com.bosssoft.hr.train.j2se.example.pojo;

import java.util.Set;

/**
 * @ClassName: com.bosssoft.hr.train.j2se.example.pojo.Role
 * @Description: 角色
 * @Author: 晶莹
 * @Date: 2023/07/12
 **/
public class Role extends BaseEntity{
    /**
     * 注意：一个角色被多个用户拥有，这里采用set不用list是避免role对象重复
     */
    private Set<User> users;
    /**
     * 角色名
     */
    private String name;
    /**
     * 角色代码
     */
    private String code;
    /**
     * 备注
     */
    private String remark;
}
