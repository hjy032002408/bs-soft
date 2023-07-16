 /**
 * @Class User
 * @Description 该文件定义User 类 描述RBAC模型中的用户
 * @author 晶莹
 * @Date 2023/07/12
 * @version 1.0.0
 */

package com.bosssoft.hr.train.j2se.example.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

/**
 * @ClassName: com.bosssoft.hr.train.j2se.example.pojo.User
 * @Description: 用户实体类 在数据中用户和角色是多对多关系通过中间表关联，因此用户内部有角色列表
 * lombok注解@Data 包含了 @getter @setter @xxContructor  @ToString @HashAndEqual 等
 * 如果需要继承父类等着加上注解的属性 callSuper
 * @Author: 晶莹
 * @Date: 2023/07/12
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseEntity{
    /**
     * 注意：用户所拥有的多个角色，这里采用set不用list是避免role对象重复
     */
    private Set<Role> roles;
    /**
     * 工号
     */
    private String code;
    /**
     * 密码
     */
    private String password;
    /**
     * 姓名
     */
    private String name;
    /**
     * 头像
     */
    private String profilePicture;
    /**
     * 性别，0男 1 女
     */
    private byte sex;
    /**
     * 生日
     */
    private Date birthday;
    /**
     * 电话
     */
    private String tel;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 其他联系
     */
    private String other;
    /**
     * 备注
     */
    private String remark;
    /**
     * 部门id
     */
    private Long departmentId;
    /**
     * 职位id，不等同于角色就是岗位
     */
    private Long positionId;

    public User(Long id,String code,String name) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    public User(Long id, Long tenantId, Long orgId, Long companyId, Long createdBy, String creator, Date createdTime, Long updatedBy, Date updatedTime, String modifier, byte status, Long version, Set<Role> roles, String code, String name, String password, String profilePicture, Date birthday, String tel, String email, String other, String remark, Long departmentId, Long positionId) {
        super(id, tenantId, orgId, companyId, createdBy, creator, createdTime, updatedBy, modifier,updatedTime,  status, version);
        this.roles = roles;
        this.code = code;
        this.name = name;
        this.password = password;
        this.profilePicture = profilePicture;
        this.birthday = birthday;
        this.tel = tel;
        this.email = email;
        this.other = other;
        this.remark = remark;
        this.departmentId = departmentId;
        this.positionId = positionId;
    }
}
