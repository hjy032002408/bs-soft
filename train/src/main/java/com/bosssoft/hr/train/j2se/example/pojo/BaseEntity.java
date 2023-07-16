/**
 * Copyright (C), 2001-2022, www.bosssof.com.cn
 * FileName: BaseEntity
 * Author: 晶莹
 * Date: 2023/07/12
 * Description: 抽取的公共的字段所有的子entity从这里集成避免冗余
 */
package com.bosssoft.hr.train.j2se.example.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;


/**
 * @ClassName: com.bosssoft.hr.train.j2se.example.pojo.BaseEntity
 * @Description: 定义所有的entity的父类，减少代码容易，该类主要针对表的公共字段
 * 该类为抽象类不允许被继承所以定义为abstract class
 * lombok注解@Data 包含了 @getter @setter  @ToString @HashAndEqual 等
 * @Author: 晶莹
 * @Date: 2023/07/12
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseEntity implements Serializable {
    /**
     * 主键
     */
    protected Long id;
    /**
     * 租户id
     */
    private Long tenantId;
    /**
     * 组织机构id
     */
    private Long orgId;
    /**
     * 公司id
     */
    private Long companyId;
    /**
     * 创建人id
     */
    private Long createdBy;
    /**
     * 创建人姓名
     */
    private String creator;
    /**
     * 创建时间
     */
    private Date createdTime;
    /**
     * 修改人id
     */
    private Long updatedBy;
    /**
     * 修改人名称
     */
    private String modifier;
    /**
     * 修改时间
     */
    private Date updatedTime;
    /**
     * 状态位（1.正常用户 0.注销用户 2.锁定用户）
     */
    private byte status;
    /**
     * 版本
     */
    private  Long version;
}
