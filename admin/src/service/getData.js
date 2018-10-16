import fecth from '../libs/fetch';

/**
 *  账号密码登录
 */
export const accountLogin = data => fecth('/admin/login', data, 'POST');

/**
 *  添加机构基本信息
 */
export const basicInfo = data => fecth('/admin/basicinfo', data, 'POST');

/**
 *  获取机构基本信息
 */
export const getSchoolList = data => fecth('/admin/getschoollist', data, 'POST');

/**
 *  获取机构总数
 */
export const getSchoolCount = () => fecth('/admin/getschoolcount');

/**
 * 更新机构信息
 */
export const updateSchool = data => fecth('/admin/updateschool', data, 'POST');

/**
 * 删除机构信息
 */
export const removeSchool = data => fecth('/admin/removeshool', data, 'POST');

/**
 * 根据id获取机构信息
 */
export const getSchoolInfo = data => fecth('/admin/getschoolinfo', data, 'POST');

/**
 * 上传机构logo
 */
export const uploadLogo = data => fecth('/admin/uploadlogo', data, 'POST');

/**
 * 添加机构详情
 */
export const addSchoolDetail = data => fecth('/admin/addschooldetail', data, 'POST');

/**
 * 获取机构详情
 */
export const getSchoolDetail = data => fecth('/admin/getschooldetail', data, 'POST');

/**
 * 更新机构详情
 */
export const updateSchoolDetail = data => fecth('/admin/updateschooldetail', data, 'POST');


/**
 *  添加老师基本信息
 */
export const teacherInfo = data => fecth('/admin/teacherinfo', data, 'POST');

/**
 *  获取老师基本信息
 */
export const getTeacherList = data => fecth('/admin/getteacherlist', data, 'POST');

/**
 *  获取老师总数
 */
export const getTeacherCount = () => fecth('/admin/getteachercount');

/**
 * 更新老师信息
 */
export const updateTeacher = data => fecth('/admin/updateteacher', data, 'POST');

/**
 * 删除老师信息
 */
export const removeTeacher = data => fecth('/admin/removeteacher', data, 'POST');

/**
 * 根据id获取老师信息
 */
export const getTeacherInfo = data => fecth('/admin/getteacherinfo', data, 'POST');

/**
 * 上传老师图片
 */
export const uploadPicture = data => fecth('/admin/uploadpicture', data, 'POST');

/**
 * 添加老师详情
 */
export const addTeacherDetail = data => fecth('/admin/addteacherdetail', data, 'POST');

/**
 * 获取老师详情
 */
export const getTeacherDetail = data => fecth('/admin/getteacherdetail', data, 'POST');

/**
 * 更新老师详情
 */
export const updateTeacherDetail = data => fecth('/admin/updateteacherdetail', data, 'POST');

/**
 *  获取发布列表
 */
export const getPublishList = data => fecth('/admin/getpublishlist', data, 'POST');

/**
 *  获取发布总数
 */
export const getPublishCount = () => fecth('/admin/getpublishcount');

/**
 * 更新发布信息
 */
export const updatePublish = data => fecth('/admin/updatepublish', data, 'POST');

/**
 * 删除发布信息
 */
export const removePublish = data => fecth('/admin/removepublish', data, 'POST');

/**
 * 获取七牛云token
 */
export const getUploadToken = () => fecth('/qiniu/getuploadtoken');

/**
 *  添加优惠信息
 */
export const addDiscounts = data => fecth('/admin/adddiscounts', data, 'POST');

/**
 *  获取机构基本信息
 */
export const getDiscountsList = data => fecth('/admin/getdiscountsList', data, 'POST');

/**
 *  获取机构总数
 */
export const getDiscountsCount = () => fecth('/admin/getdiscountscount');

/**
 * 更新机构信息
 */
export const updateDiscounts = data => fecth('/admin/updatediscounts', data, 'POST');

/**
 * 删除机构信息
 */
export const removeDiscounts = data => fecth('/admin/removediscounts', data, 'POST');
